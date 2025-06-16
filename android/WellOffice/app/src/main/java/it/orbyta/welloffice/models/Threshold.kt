package it.orbyta.welloffice.models

data class Threshold(
    var sensorType: String,
    var optimalMinValue: String,
    var optimalMaxValue: String,
    var acceptableMinValue: String,
    var acceptableMaxValue: String
)
