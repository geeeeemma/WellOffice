package it.orbyta.welloffice.models

data class Room(
    var id: String = "",
    var name: String = "",
    var sensors: List<Sensor> = emptyList(),
    var roomThresholds: List<Threshold> = emptyList()
)
