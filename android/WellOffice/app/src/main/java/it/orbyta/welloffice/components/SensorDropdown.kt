package it.orbyta.welloffice.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import it.orbyta.welloffice.models.Sensor
import it.orbyta.welloffice.theme.BigHorizontalPadding
import it.orbyta.welloffice.theme.CardRadius

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SensorDropdown(
    sensors: List<Sensor> = emptyList(),
    icon: Int = 0,
    sensorType: String = "",
    selectedSensor: Sensor = Sensor(),
    onOptionChanged: (Sensor) -> Unit,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

    println("LOL EXPANDED -> $expanded")
    println("LOL SELECTED SENSOR -> ${selectedSensor.name}")

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded },
        modifier = modifier
    ) {
        Card(
            modifier = Modifier
                .menuAnchor()
                .fillMaxWidth()
                .clickable {  },
            shape = RoundedCornerShape(CardRadius),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.secondaryContainer
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(BigHorizontalPadding),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Thermometer icon
                Icon(
                    painter = painterResource(icon), // You'll need to add this icon
                    contentDescription = null,
                    modifier = Modifier
                        .size(32.dp)
                        .padding(end = 12.dp)
                )

                // Alternative if you don't have the icon - using a simple circle
                /*
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .background(Color.Black, CircleShape)
                        .padding(end = 12.dp)
                )
                */

                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = sensorType,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.secondary
                    )
                    if(
                        selectedSensor.id != ""
                    )
                        Text(
                            text = selectedSensor.name,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.tertiary
                        )
                }

                // Dropdown arrow
                Icon(
                    imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = "Dropdown arrow",
                    modifier = Modifier.size(24.dp)
                )
            }
        }

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.fillMaxWidth()
                        .background(MaterialTheme.colorScheme.secondaryContainer)
        ) {
            sensors.forEach { sensor ->
                DropdownMenuItem(
                    text = {
                        Text(
                            text = sensor.name,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.secondary
                        )
                    },
                    onClick = {
                        onOptionChanged(
                            sensor
                        )
                        expanded = false
                    },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}