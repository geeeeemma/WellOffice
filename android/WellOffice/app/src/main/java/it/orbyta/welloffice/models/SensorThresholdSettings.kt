package it.orbyta.welloffice.models

import androidx.compose.ui.graphics.Color

data class SensorThresholdSettings(
    var primaryColor: Color,
    var secondaryColor: Color,
    var tertiaryColor: Color,
    var optimalThreshold: String,
    var status: String
)
