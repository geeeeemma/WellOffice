package it.orbyta.welloffice.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import it.orbyta.welloffice.models.Room
import it.orbyta.welloffice.theme.BigVerticalPadding
import it.orbyta.welloffice.theme.CardRadius
import it.orbyta.welloffice.theme.NormalHorizontalPadding
import it.orbyta.welloffice.theme.SmallVerticalPadding

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoomDropdown(
    rooms: List<Room> = emptyList(),
    selectedRoom: Room = Room(),
    onOptionChanged: (Room) -> Unit,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

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
            // Main dropdown container
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.secondaryContainer)
                    .padding(
                        horizontal = NormalHorizontalPadding,
                        vertical = BigVerticalPadding
                    ),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Room text
                Text(
                    text = selectedRoom.name,
                    style = MaterialTheme.typography.labelSmall,
                    color = if (selectedRoom.id != "") MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.tertiary
                )


                // Dropdown arrow
                Icon(
                    imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = "Dropdown arrow",
                    modifier = Modifier.size(24.dp)
                )
            }

            // Dropdown menu
            ExposedDropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(
                        start = 0.dp,
                        top = SmallVerticalPadding,
                        end = 0.dp,
                        bottom = 0.dp
                    )
                    .background(MaterialTheme.colorScheme.secondaryContainer)
            ) {
                rooms.forEach { room ->
                    DropdownMenuItem(
                        text = {
                            Text(
                                text = room.name,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.secondary,
                                modifier = Modifier.padding(vertical = 4.dp)
                            )
                        },
                        onClick = {
                            onOptionChanged(
                                room
                            )
                            expanded = false
                        },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    }
}