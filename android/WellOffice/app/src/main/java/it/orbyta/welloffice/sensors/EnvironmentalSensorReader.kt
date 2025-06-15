package it.orbyta.welloffice.sensors

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import it.orbyta.welloffice.structures.EnvironmentData

class EnvironmentalSensorReader(
    private val context: Context
) : SensorEventListener {
    private var callback: (EnvironmentData) -> Unit = {}
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val lightSensor = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT)
    private val temperatureSensor = sensorManager.getDefaultSensor(Sensor.TYPE_AMBIENT_TEMPERATURE)
    private val humiditySensor = sensorManager.getDefaultSensor(Sensor.TYPE_RELATIVE_HUMIDITY)
    
    fun startReading(
        callback: (EnvironmentData) -> Unit
    ) {
        this.callback = callback
        lightSensor?.let { sensor ->
            sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL)
        }
        temperatureSensor?.let { sensor ->
            sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL)
        }
        
        humiditySensor?.let { sensor ->
            sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }
    
    override fun onSensorChanged(
        event: SensorEvent?
    ) {
        event?.let {
            when (it.sensor.type) {
                Sensor.TYPE_AMBIENT_TEMPERATURE -> {
                    val temperature = it.values[0] // Celsius
                    println("TempSensor Temperature: ${temperature}°C")
                    callback(
                        EnvironmentData.TEMPERATURE(
                            temperature
                        )
                    )
                    
                    /*val fahrenheit = temperature * 9/5 + 32
                    println("TempSensor Temperature: ${fahrenheit}°F")*/
                }
                
                Sensor.TYPE_RELATIVE_HUMIDITY -> {
                    val humidity = it.values[0] // Percentage
                    println("HumiditySensor Relative humidity: $humidity%")
                    callback(
                        EnvironmentData.HUMIDITY(
                            humidity
                        )
                    )
                    /*
                    when {
                        humidity < 30 -> println("HumiditySensor Low humidity - dry air")
                        humidity > 70 -> println("HumiditySensor High humidity - humid air")
                        else -> println("HumiditySensor Comfortable humidity level")
                    }*/
                }

                Sensor.TYPE_LIGHT -> {
                    val brightness = it.values[0]
                    println("LightSensor Light level: $brightness lux")

                    callback(
                        EnvironmentData.BRIGHTNESS(
                            brightness
                        )
                    )

                    /*when {
                        lightLevel < 10 -> Log.d("LightSensor", "Dark environment")
                        lightLevel < 200 -> Log.d("LightSensor", "Dim environment")
                        lightLevel < 1000 -> Log.d("LightSensor", "Normal indoor lighting")
                        lightLevel < 10000 -> Log.d("LightSensor", "Bright indoor lighting")
                        else -> Log.d("LightSensor", "Outdoor lighting/sunlight")
                    }*/
                }
            }
        }
    }
    
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    fun stopReading() {
        sensorManager.unregisterListener(this)
    }

}