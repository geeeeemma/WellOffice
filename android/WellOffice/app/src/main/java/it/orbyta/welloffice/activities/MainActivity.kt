package it.orbyta.welloffice.activities

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Space
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelProvider
import coil.compose.AsyncImage
import coil.decode.SvgDecoder
import coil.request.ImageRequest
import com.google.accompanist.systemuicontroller.rememberSystemUiController
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import it.orbyta.welloffice.components.RoomDropdown
import it.orbyta.welloffice.components.SensorCard
import it.orbyta.welloffice.components.SensorDropdown
import it.orbyta.welloffice.constants.SensorTypes
import it.orbyta.welloffice.models.AmbientData
import it.orbyta.welloffice.models.Option
import it.orbyta.welloffice.models.Room
import it.orbyta.welloffice.models.Sensor
import it.orbyta.welloffice.models.SensorThresholdSettings
import it.orbyta.welloffice.models.Threshold
import it.orbyta.welloffice.network.NetworkManager
import it.orbyta.welloffice.sensors.AmbientSoundSensor
import it.orbyta.welloffice.sensors.EnvironmentalSensorReader
import it.orbyta.welloffice.structures.EnvironmentData
import it.orbyta.welloffice.theme.BigHorizontalPadding
import it.orbyta.welloffice.theme.BigSpace
import it.orbyta.welloffice.theme.BigVerticalPadding
import it.orbyta.welloffice.theme.CardRadius
import it.orbyta.welloffice.theme.DarkGreen
import it.orbyta.welloffice.theme.DarkRed
import it.orbyta.welloffice.theme.DarkYellow
import it.orbyta.welloffice.theme.EnormousSpace
import it.orbyta.welloffice.theme.Green
import it.orbyta.welloffice.theme.LightGreen
import it.orbyta.welloffice.theme.LightRed
import it.orbyta.welloffice.theme.LightYellow
import it.orbyta.welloffice.theme.LocationRowHeight
import it.orbyta.welloffice.theme.NormalHorizontalPadding
import it.orbyta.welloffice.theme.NormalVerticalPadding
import it.orbyta.welloffice.theme.Red
import it.orbyta.welloffice.theme.SensorsFoundLogoHeight
import it.orbyta.welloffice.theme.SmallSpace
import it.orbyta.welloffice.theme.TopBarHeight
import it.orbyta.welloffice.theme.TopBarLogoHeight
import it.orbyta.welloffice.theme.WellOfficeTheme
import it.orbyta.welloffice.theme.Yellow
import it.orbyta.welloffice.viewmodels.WellViewModel
import it.orbyta.welloffice.viewmodels.WellViewModelFactory
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import java.text.DecimalFormat
import it.orbyta.welloffice.R

class MainActivity : ComponentActivity() {

    private val BASE_URL = "http://172.20.10.4:7254"
    private val networkManager: NetworkManager = NetworkManager()
    private var environmentalSensorReader: EnvironmentalSensorReader? = null
    private var ambientSoundSensor: AmbientSoundSensor? = null
    private lateinit var viewModel: WellViewModel

    /*val rooms = listOf(
        Room(
            id = "1",
            name = "Stanza 1",
            sensors = listOf(
                Sensor(
                    id = "1",
                    name = "Luce 1",
                    type = SensorTypes.LIGHT.type,
                    unitMeasure = "Lum"
                ),
                Sensor(
                    id = "2",
                    name = "Luce 2",
                    type = SensorTypes.LIGHT.type,
                    unitMeasure = "Lum"
                ),
                Sensor(
                    id = "3",
                    name = "Luce 3",
                    type = SensorTypes.LIGHT.type,
                    unitMeasure = "Lum"
                ),
                Sensor(
                    id = "1",
                    name = "Volume 1",
                    type = SensorTypes.NOISE.type,
                    unitMeasure = "Db"
                ),
                Sensor(
                    id = "2",
                    name = "Volume 2",
                    type = SensorTypes.NOISE.type,
                    unitMeasure = "Db"
                ),
                Sensor(
                    id = "3",
                    name = "Volume 3",
                    type = SensorTypes.NOISE.type,
                    unitMeasure = "Db"
                )
            ),
            roomThresholds = listOf(
                Threshold(
                    sensorType = SensorTypes.LIGHT.type,
                    optimalMinValue = "550",
                    optimalMaxValue = "800",
                    acceptableMinValue = "800",
                    acceptableMaxValu = "1400"
                ),
                Threshold(
                    sensorType = SensorTypes.NOISE.type,
                    optimalMinValue = "-50",
                    optimalMaxValue = "-20",
                    acceptableMinValue = "-20",
                    acceptableMaxValu = "30"
                )
            )
        ),
        Room(
            id = "1",
            name = "Stanza 2",
            sensors = listOf(
                Sensor(
                    id = "1",
                    name = "Luce 4",
                    type = SensorTypes.LIGHT.type,
                    unitMeasure = "Lum"
                ),
                Sensor(
                    id = "2",
                    name = "Luce 5",
                    type = SensorTypes.LIGHT.type,
                    unitMeasure = "Lum"
                ),
                Sensor(
                    id = "1",
                    name = "Volume 4",
                    type = SensorTypes.NOISE.type,
                    unitMeasure = "Db"
                ),
                Sensor(
                    id = "2",
                    name = "Volume 5",
                    type = SensorTypes.NOISE.type,
                    unitMeasure = "Db"
                )
            ),
            roomThresholds = listOf(
                Threshold(
                    sensorType = SensorTypes.LIGHT.type,
                    optimalMinValue = "550",
                    optimalMaxValue = "800",
                    acceptableMinValue = "800",
                    acceptableMaxValu = "1400"
                ),
                Threshold(
                    sensorType = SensorTypes.NOISE.type,
                    optimalMinValue = "-50",
                    optimalMaxValue = "-20",
                    acceptableMinValue = "-20",
                    acceptableMaxValu = "30"
                )
            )
        )
    )*/

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            startListeners()
        } else {
            // Permission denied - handle accordingly
            Toast.makeText(this, "Il permesso per il microfono è necessario al funzionamento dell'app", Toast.LENGTH_SHORT).show()
        }
    }

    private fun requestMicrophonePermission() {
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED -> {
                // Permission already granted
                startListeners()
            }
            shouldShowRequestPermissionRationale(Manifest.permission.RECORD_AUDIO) -> {
                // Show explanation dialog
                //showPermissionRationale()
            }
            else -> {
                // Request permission
                requestPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewModel = ViewModelProvider(this, WellViewModelFactory())[WellViewModel::class.java]
        requestMicrophonePermission()
        readRooms()
        startRepeatingSendData()
        enableEdgeToEdge()
        setContent {
            WellOfficeTheme(
                dynamicColor = false
            ) {
                ScaffoldOrbyta()
            }
        }
    }

    fun startListeners() {
        environmentalSensorReader = EnvironmentalSensorReader(this)
        ambientSoundSensor = AmbientSoundSensor(this)

        environmentalSensorReader?.startReading {
                value ->
            when(
                value
            ) {
                is EnvironmentData.BRIGHTNESS -> {
                    viewModel.setAmbientData {
                        AmbientData(
                            brightness = value.value,
                            temperature = it.temperature,
                            humidity = it.humidity,
                            noise = it.noise
                        )
                    }
                }
                is EnvironmentData.TEMPERATURE -> {
                    viewModel.setAmbientData {
                        AmbientData(
                            brightness = it.brightness,
                            temperature = value.value,
                            humidity = it.humidity,
                            noise = it.noise
                        )
                    }
                }
                is EnvironmentData.HUMIDITY -> {
                    viewModel.setAmbientData {
                        AmbientData(
                            brightness = it.brightness,
                            temperature = it.temperature,
                            humidity = value.value,
                            noise = it.noise
                        )
                    }
                }
                else -> {}
            }
        }
        ambientSoundSensor?.startMonitoring {
                value ->
            when(
                value
            ) {
                is EnvironmentData.NOISE -> {
                    viewModel.setAmbientData {
                        AmbientData(
                            brightness = it.brightness,
                            temperature = it.temperature,
                            humidity = it.humidity,
                            noise = value.value
                        )
                    }
                }
                else -> {}
            }
        }
    }

    fun startRepeatingSendData() {
        CoroutineScope(Dispatchers.Main).launch {
            while (true) {
                // Your task here
                println("Task executed at ${System.currentTimeMillis()}")

                sendSensorsData()

                delay(5000)
            }
        }
    }

    fun readRooms() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = networkManager.get("$BASE_URL/api/Room/with-sensors")
                if (response.isSuccess) {

                    viewModel.setRooms {
                        convertJsonArrayToList(
                            response.data
                        )
                    }

                    // Handle successful response
                    println("Network Data: ${response.data}")
                } else {
                    // Handle error
                    println("Network Error: ${response.errorMessage}")
                }
            } catch (e: Exception) {
                println("Network Exception: ${e.message}")
            }
        }
    }

    fun sendSensorsData() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                if(
                    viewModel.selectedLightSensor.value.id != "" ||
                    viewModel.selectedNoiseSensor.value.id != ""
                ) {
                    val response = networkManager.postJson(
                        "$BASE_URL/api/SensorData",
                        createJsonForSendSensorsData()
                    )

                    if (response.isSuccess) {
                        // Handle successful response
                        println("Network Data: ${response.data}")
                    } else {
                        // Handle error
                        println("Network Error: ${response.errorMessage}")
                    }
                }
            } catch (e: Exception) {
                println("Network Exception: ${e.message}")
            }
        }
    }

    fun convertJsonArrayToList(jsonArrayString: String): List<Room> {
        val gson = Gson()
        val listType = object : TypeToken<List<Room>>() {}.type
        return gson.fromJson(jsonArrayString, listType)
    }

    fun createJsonForSendSensorsData(): JSONObject =
        JSONObject().apply {
            val room = viewModel.selectedRoom.value
            val lightSensor = viewModel.selectedLightSensor.value
            val noiseSensor = viewModel.selectedNoiseSensor.value
            val ambientData = viewModel.ambientStateFlow.value

            this.put("roomId", room.id)
            this.put(
                "Sensors",
                JSONArray().apply {
                    if(
                        lightSensor.id != ""
                    )
                        this.put(
                            JSONObject().apply {
                                this.put("id", lightSensor.id)
                                this.put("value", ambientData.brightness)
                            }
                        )
                    if(
                        noiseSensor.id != ""
                    )
                        this.put(
                            JSONObject().apply {
                                this.put("id", noiseSensor.id)
                                this.put("value", ambientData.noise)
                            }
                        )
                }
            )
        }

    fun getSensorThresholdSettings(
        value: Float,
        threshold: Threshold
    ): SensorThresholdSettings {

        val primaryColor = if(
            value < threshold.optimalMaxValue.toFloat()
        )
            LightGreen
        else if(
            value < threshold.acceptableMaxValue.toFloat()
        )
            LightYellow
        else
            LightRed

        val secondaryColor = if(
            value < threshold.optimalMaxValue.toFloat()
        )
            Green
        else if(
            value < threshold.acceptableMaxValue.toFloat()
        )
            Yellow
        else
            Red

        val tertiaryColor = if(
            value < threshold.optimalMaxValue.toFloat()
        )
            DarkGreen
        else if(
            value < threshold.acceptableMaxValue.toFloat()
        )
            DarkYellow
        else
            DarkRed

        val status = if(
            value < threshold.optimalMaxValue.toFloat()
        )
            getString(R.string.optimal_label)
        else if(
            value < threshold.acceptableMaxValue.toFloat()
        )
            getString(R.string.attention_label)
        else
            getString(R.string.critical_label)


        return SensorThresholdSettings(
            primaryColor = primaryColor,
            secondaryColor = secondaryColor,
            tertiaryColor = tertiaryColor,
            optimalThreshold = "${threshold.optimalMinValue}-${threshold.optimalMaxValue}",
            status = status
        )
    }

    @Composable
    fun ScaffoldOrbyta() {
        var rooms = viewModel.rooms.collectAsState()
        var selectedRoom = viewModel.selectedRoom.collectAsState()
        var selectedLightSensor = viewModel.selectedLightSensor.collectAsState()
        var selectedNoiseSensor = viewModel.selectedNoiseSensor.collectAsState()
        var sensorsCount by remember {
            mutableStateOf(
                selectedRoom.value.sensors.size
            )
        }

        LaunchedEffect(
            selectedRoom
        ) {
            viewModel.clearSelectedLightSensor()
            viewModel.clearSelectedNoiseSensor()
            sensorsCount = selectedRoom.value.sensors.size
        }


        /*val systemUiController = rememberSystemUiController()

        // Make status bar light with dark content
        LaunchedEffect(Unit) {
            systemUiController.setStatusBarColor(
                color = Color.White, // Light background
                darkIcons = true     // Dark icons/text
            )
        }*/

        Scaffold(
            modifier = Modifier.fillMaxSize()
                .background(MaterialTheme.colorScheme.primaryContainer)
        ) {
            innerPadding ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
                    .fillMaxHeight()
                    .background(MaterialTheme.colorScheme.primaryContainer)
            ) {
                BasicTopAppBar(
                    modifier = Modifier
                )
                OfficeRow(
                    location="Piazza Castello 113, Torino"
                )
                Spacer(
                    modifier = Modifier.fillMaxWidth()
                        .height(BigSpace)
                )
                RoomDropdown(
                    rooms = rooms.value,
                    selectedRoom = selectedRoom.value,
                    onOptionChanged = {
                        room ->
                        viewModel.setSelectedRoom {
                            room
                        }

                    },
                    modifier = Modifier.padding(
                        horizontal = BigHorizontalPadding,
                        vertical = 0.dp
                    )
                )
                RoomSettings(
                    data = selectedRoom.value,
                    selectedLightSensor = selectedLightSensor.value,
                    selectedNoiseSensor = selectedNoiseSensor.value,
                    onSelectedLightSensorChanged = {
                        sensor ->
                        viewModel.setSelectedSensorLight {
                            sensor
                        }
                    },
                    onSelectedNoiseSensorChanged = {
                            sensor ->
                        viewModel.setSelectedSensorNoise {
                            sensor
                        }
                    },
                    sensorsCount = sensorsCount
                )
                Spacer(
                    modifier = Modifier.height(SmallSpace)
                )
                SensorsValues(
                    data = selectedRoom.value,
                    selectedLightSensor = selectedLightSensor.value,
                    selectedNoiseSensor = selectedNoiseSensor.value,
                )
            }
        }


    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun BasicTopAppBar(
        modifier: Modifier = Modifier
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
                .height(TopBarHeight)
                .background(MaterialTheme.colorScheme.primary)
        ) {
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data(R.drawable.toolbar_logo)
                    .decoderFactory(SvgDecoder.Factory())
                    .build(),
                contentDescription = null,
                modifier = modifier.height(TopBarLogoHeight)
            )
        }
    }

    @Composable
    fun OfficeRow(
        location: String,
        modifier: Modifier = Modifier
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
                .height(LocationRowHeight)
                .background(MaterialTheme.colorScheme.secondaryContainer)
        ) {
            Text(
                text = location,
                style = MaterialTheme.typography.labelMedium,
                modifier = modifier.padding(
                    horizontal = NormalHorizontalPadding,
                    vertical = NormalVerticalPadding
                )
            )
        }
    }

    @Composable
    fun RoomSettings(
        data: Room,
        selectedLightSensor: Sensor,
        selectedNoiseSensor: Sensor,
        sensorsCount: Int,
        onSelectedLightSensorChanged: (Sensor) -> Unit,
        onSelectedNoiseSensorChanged: (Sensor) -> Unit,
        modifier: Modifier = Modifier
    ) {

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth().padding(
                horizontal = BigHorizontalPadding,
                vertical = SmallSpace
            )
        ) {
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth(),
                    shape = RoundedCornerShape(CardRadius),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center,
                        modifier = modifier.fillMaxWidth().padding(
                            horizontal = NormalHorizontalPadding,
                            vertical = SmallSpace
                        )
                    ) {
                        AsyncImage(
                            model = ImageRequest.Builder(LocalContext.current)
                                .data(R.drawable.sensors)
                                .decoderFactory(SvgDecoder.Factory())
                                .build(),
                            contentDescription = null,
                            modifier = modifier.height(SensorsFoundLogoHeight)
                        )
                        Text(
                            text = getString(R.string.sensors_found, sensorsCount.toString()),
                            style = MaterialTheme.typography.titleSmall,
                            color = MaterialTheme.colorScheme.secondary,
                            modifier = modifier.padding(
                                horizontal = NormalHorizontalPadding,
                                vertical = 0.dp
                            )
                        )
                    }

                }
                Spacer(
                    modifier = Modifier.height(SmallSpace)
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    SensorDropdown(
                        sensors = data.sensors.filter {
                            sensor ->
                            sensor.type == SensorTypes.LIGHT.type
                        },
                        icon = R.drawable.sun,
                        sensorType = getString(R.string.sensor_light),
                        selectedSensor = selectedLightSensor,
                        onOptionChanged = {
                            sensor ->
                            onSelectedLightSensorChanged(
                                sensor
                            )
                        },
                        modifier = Modifier.weight(0.5f)
                    )
                    Spacer(
                        modifier = Modifier.width(BigHorizontalPadding)
                    )
                    SensorDropdown(
                        sensors = data.sensors.filter {
                            sensor ->
                            sensor.type == SensorTypes.NOISE.type
                        },
                        icon = R.drawable.volume,
                        sensorType = getString(R.string.sensor_noise),
                        selectedSensor = selectedNoiseSensor,
                        onOptionChanged = {
                            sensor ->
                            onSelectedNoiseSensorChanged(
                                sensor
                            )
                        },
                        modifier = Modifier.weight(0.5f)
                    )
                }
            }
        }
    }

    @Composable
    fun SensorsValues(
        data: Room,
        selectedLightSensor: Sensor,
        selectedNoiseSensor: Sensor,
        modifier: Modifier = Modifier
    ) {
        var ambientData = viewModel.ambientStateFlow.collectAsState()
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth().padding(
                    horizontal = BigHorizontalPadding,
                    vertical = 0.dp
                )
            ) {

                if (
                    selectedLightSensor.id != ""
                )
                    SensorCard(
                        sensorName = selectedLightSensor.name,
                        sensorType = getString(R.string.sensor_light),
                        sensorValue = ambientData.value.brightness.toString(),
                        sensorUnitMeasure = selectedLightSensor.unitMeasure,
                        iconId = R.drawable.sun,
                        sensorThresholdSettings = getSensorThresholdSettings(
                            value = ambientData.value.brightness,
                            threshold = data.roomThresholds.first {
                                    threshold ->
                                threshold.sensorType == SensorTypes.LIGHT.type
                            }
                        ),
                        modifier = Modifier
                    )

                if (
                    selectedLightSensor.id != ""
                )
                    Spacer(
                        modifier = Modifier.height(SmallSpace)
                    )

                if (
                    selectedNoiseSensor.id != ""
                )
                    SensorCard(
                        sensorName = selectedNoiseSensor.name,
                        sensorType = getString(R.string.sensor_noise),
                        sensorValue = ambientData.value.noise.toString(),
                        sensorUnitMeasure = selectedNoiseSensor.unitMeasure,
                        iconId = R.drawable.volume,
                        sensorThresholdSettings = getSensorThresholdSettings(
                            value = ambientData.value.noise,
                            threshold = data.roomThresholds.first {
                                    threshold ->
                                threshold.sensorType == SensorTypes.NOISE.type
                            }
                        ),
                        modifier = Modifier
                    )

            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        environmentalSensorReader?.stopReading()
        ambientSoundSensor?.stopMonitoring()
    }
}