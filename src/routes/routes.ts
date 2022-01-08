import {Request, Response, Router } from 'express'
import { Equipos } from '../model/equipos'
import { Jugadores } from '../model/jugadores'
import { db } from '../database/database'

class DatoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getEquipos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await Equipos.aggregate(
                [
                    {
                        $lookup: {
                            from: 'jugadores',
                            localField: '_nombre',
                            foreignField: '_nomEquipo',
                            as: 'jugadores'
                        }
                    }
                ]
            )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getJugadores = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await Jugadores.find({})
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private getEquipo = async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        .then (async () => {
            const query = await Equipos.aggregate(
                [
                    {
                        $lookup: {
                            from: 'jugadores',
                            localField: '_nombre',
                            foreignField: '_nomEquipo',
                            as: 'jugadores'
                        }
                    }, 
                    {
                        $match: {
                            _nombre: nombre
                        }
                    }
                ]
            )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private crearEquipo = async (req: Request, res: Response) => {
        const equi = new Equipos(req.body)
        await db.conectarBD()
            .then(async (mensaje) => {
                console.log(mensaje)
                await equi.save()
                    .then ((doc: any) => res.send('Equipo salvado: ' + doc))
                    .catch((err: any) => res.send(err))
            })
            .catch((mensaje) => {
                res.send(mensaje)
            })
        await db.desconectarBD()
    }

    private crearJugador = async (req: Request, res: Response) => {
        const jug = new Jugadores(req.body)
        await db.conectarBD()
            .then(async (mensaje) => {
                console.log(mensaje)
                await jug.save()
                    .then((doc: any) => res.send('Jugador salvado: ' + doc))
                    .catch((err: any) => res.send(err))
            })
            .catch((mensaje) => {
                res.send(mensaje)
            })
        await db.desconectarBD()
    }

    private modificarEquipo = async (req: Request, res: Response) => {
        //const {nombre} = req.params
        //const {/*tipoEquipo,*/ partidosJugados, victorias, derrotas, puntos, ganancias, 
        //    asciende, aficionadosEsti} = req.body
        const equipo = new Equipos (req.body)
        await db.conectarBD()
        await Equipos.findOneAndUpdate(
            {
                _nombre: equipo._nombre
            },
            {
                //_tipoEquipo: tipoEquipo,
                _partidosJugados: equipo._partidosJugados,
                _victorias: equipo._victorias,
                _derrotas: equipo._derrotas,
                _puntos: equipo._puntos,
                _ganancias: equipo._ganancias,
                _asciende: equipo._asciende,
                _aficionadosEsti: equipo._aficionadosEsti      
            },
            {
                new: true,
                runValidators: true
            }
        )
        .then ((doc: any) => res.send('Equipo modificado: ' +doc))
        .catch ((err: any) => res.send('Error: ' + err))
        await db.desconectarBD()
    }

    private modificarJugador = async (req: Request, res: Response) => {
        //const {alias} = req.params
        //const {numPartidos, goles, asistencias, expulsiones, salarioInicial} = req.body
        const jugador = new Jugadores (req.body)
        await db.conectarBD()
        await Jugadores.findOneAndUpdate(
            {
                _alias: jugador._alias
            },
            {
                _numPartidos: jugador._numPartidos,
                _goles: jugador._goles,
                _asistencias: jugador._asistencias,
                _expulsiones: jugador._expulsiones,
                _salarioInicial: jugador._salarioInicial
            },
            {
                new: true,
                runValidators: true
            }
        )
        .then((doc: any) => res.send('Jugador modicficado: ' + doc))
        .catch((err: any) => res.send('Error: ' + err))
        await db.desconectarBD()
    }

    private eliminarJugador = async (req: Request, res: Response) => {
        const {alias} = req.params
        await db.conectarBD()
        await Jugadores.findOneAndDelete(
            {
                '_alias': alias
            }
        )
        .then((doc: any) => res.send('Jugador borrado ' + doc))
        .catch((err: any) => res.send('Error: ' + err))
        await db.desconectarBD()
    }

    misRutas(){
        this._router.get('/equipos', this.getEquipos)
        this._router.get('/jugadores', this.getJugadores)
        this._router.get('/equipo/:nombre', this.getEquipo)
        this._router.post('/equipo', this.crearEquipo)
        this._router.post('/jugador', this.crearJugador)
        this._router.put('/equipo/:nombre', this.modificarEquipo)
        this._router.put('/jugador/:alias', this.modificarJugador)
        this._router.delete('/borrarJugador/:alias', this.eliminarJugador)
    }
}

const obj = new DatoRoutes()
obj.misRutas()
export const routes = obj.router
