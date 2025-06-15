package it.orbyta.welloffice.structures

sealed class EnvironmentData {
    data class BRIGHTNESS(
        var value: Float
    ): EnvironmentData()
    data class TEMPERATURE(
        var value: Float
    ): EnvironmentData()
    data class HUMIDITY(
        var value: Float
    ): EnvironmentData()
    data class NOISE(
        var value: Float
    ): EnvironmentData()
}