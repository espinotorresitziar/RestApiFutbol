import { Schema, model } from "mongoose";

const jugadorSchema = new Schema (
    {
        /*_id: {
            type: Number,
            index: false
        },*/
        /*_tipoJugador: {
            type: String
        },*/
        _nombre: {
            type: String
        },
        _alias: {
            type: String,
            unique: true
        },
        _nomEquipo: {
            type: String
        },
        _numPartidos: {
            type: Number
        },
        _goles: {
            type: Number
        },
        _asistencias: {
            type: Number
        },
        _expulsiones: {
            type: Number
        },
        _europeo: {
            type: Boolean
        },
        _pais: {
            type: String
        },
        _salarioInicial: {
            type: Number
        }
    }
)

export type iJugador = {
    //_id: number | null,
    //_tipoJugador: string | null,
    _nombre: string | null,
    _alias: string | null,
    _nomEquipo: string | null,
    _numPartidos: number | null,
    _goles: number | null,
    _asistencias: number | null,
    _expulsiones: number | null,
    _salarioInicial: number | null
}

export type iInternacional = {
    //_id: number | null,
    //_tipoJugador: string | null,
    _nombre: string | null,
    _alias: string | null,
    _nomEquipo: string | null,
    _numPartidos: number | null,
    _goles: number | null,
    _asistencias: number | null,
    _expulsiones: number | null,
    _europeo: boolean | null,
    _pais: string | null,
    _salarioInicial: number | null
}

export const Jugadores = model ("jugadores", jugadorSchema)