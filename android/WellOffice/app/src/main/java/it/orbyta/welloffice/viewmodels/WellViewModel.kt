package it.orbyta.welloffice.viewmodels

import androidx.lifecycle.ViewModel
import it.orbyta.welloffice.models.AmbientData
import it.orbyta.welloffice.models.Room
import it.orbyta.welloffice.models.Sensor
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class WellViewModel : ViewModel() {

    private val _rooms = MutableStateFlow(
        emptyList<Room>()
    )
    val rooms: StateFlow<List<Room>> = _rooms.asStateFlow()

    private val _ambientStateFlow = MutableStateFlow(
        AmbientData()
    )
    val ambientStateFlow: StateFlow<AmbientData> = _ambientStateFlow.asStateFlow()

    private val _selectedRoom = MutableStateFlow(
        Room()
    )
    val selectedRoom: StateFlow<Room> = _selectedRoom.asStateFlow()

    private val _selectedLightSensor = MutableStateFlow(
        Sensor()
    )
    val selectedLightSensor: StateFlow<Sensor> = _selectedLightSensor.asStateFlow()

    private val _selectedNoiseSensor = MutableStateFlow(
        Sensor()
    )
    val selectedNoiseSensor: StateFlow<Sensor> = _selectedNoiseSensor.asStateFlow()

    fun setRooms(
        callback: (List<Room>) -> List<Room>
    ) {
        _rooms.update {
            callback(
                it
            )
        }
    }

    fun setAmbientData(
        callback: (AmbientData) -> AmbientData
    ) {
        _ambientStateFlow.update {
            callback(
                it
            )
        }
    }

    fun setSelectedRoom(
        callback: (Room) -> Room
    ) {
        _selectedRoom.update {
            callback(
                it
            )
        }
    }

    fun setSelectedSensorLight(
        callback: (Sensor) -> Sensor
    ) {
        _selectedLightSensor.update {
            callback(
                it
            )
        }
    }

    fun setSelectedSensorNoise(
        callback: (Sensor) -> Sensor
    ) {
        _selectedNoiseSensor.update {
            callback(
                it
            )
        }
    }

    fun clearSelectedLightSensor() {
        _selectedLightSensor.update {
            Sensor()
        }
    }

    fun clearSelectedNoiseSensor() {
        _selectedNoiseSensor.update {
            Sensor()
        }
    }

}