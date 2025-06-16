package it.orbyta.welloffice.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import it.orbyta.welloffice.R
import it.orbyta.welloffice.models.SensorThresholdSettings
import it.orbyta.welloffice.theme.BadgeHeight
import it.orbyta.welloffice.theme.BadgeRadius
import it.orbyta.welloffice.theme.MediumSpace
import it.orbyta.welloffice.theme.NormalHorizontalPadding
import it.orbyta.welloffice.theme.NormalVerticalPadding

@Composable
fun SensorCard(
    sensorName: String = "",
    sensorType: String = "",
    sensorValue: String = "",
    sensorUnitMeasure: String = "",
    iconId: Int,
    sensorThresholdSettings: SensorThresholdSettings,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .wrapContentHeight()
            .fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.Start,
            modifier = Modifier.padding(
                horizontal = NormalHorizontalPadding,
                vertical = NormalVerticalPadding
            )
        ) {
            Text(
                text = stringResource(R.string.sensor_reading, sensorName),
                style = MaterialTheme.typography.labelLarge,
                color = Color.Black,
            )
            Text(
                text = "$sensorValue $sensorUnitMeasure",
                style = MaterialTheme.typography.labelLarge,
                color = Color.Black
            )
        }
    }
    /*
    Card(
        modifier = modifier
            .wrapContentWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = sensorThresholdSettings.primaryColor
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
        ) {
            Text(
                text = stringResource(R.string.sensor_reading, sensorName),
                style = MaterialTheme.typography.labelLarge,
                color = Color.Black,
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Simple thermometer icon using Box and shapes
                    Icon(
                        painter = painterResource(iconId), // You'll need to add this icon
                        contentDescription = null,
                        tint = sensorThresholdSettings.tertiaryColor,
                        modifier = Modifier
                            .size(24.dp)
                            .padding(end = NormalHorizontalPadding)
                    )

                    Text(
                        text = sensorType,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.Black
                    )
                }
                Box(
                    modifier = Modifier.height(BadgeHeight)
                        .wrapContentWidth()
                        .clip(
                            RoundedCornerShape(
                                BadgeRadius
                            )
                        )
                        .background(sensorThresholdSettings.secondaryColor)
                ) {
                    Text(
                        text = sensorThresholdSettings.status,
                        style = MaterialTheme.typography.displaySmall,
                        color = sensorThresholdSettings.tertiaryColor,
                        modifier = Modifier.padding(
                            horizontal = NormalHorizontalPadding,
                            vertical = 0.dp
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(MediumSpace))

            Text(
                text = "$sensorValue $sensorUnitMeasure",
                style = MaterialTheme.typography.titleLarge,
                color = Color.Black
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = stringResource(R.string.optimal_range, sensorThresholdSettings.optimalThreshold, sensorUnitMeasure),
                style = MaterialTheme.typography.labelMedium
            )
        }
    }*/
}
