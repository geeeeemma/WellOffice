package it.orbyta.welloffice.network

import kotlinx.coroutines.*
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import org.json.JSONObject
import org.json.JSONException

/**
 * NetworkManager - A comprehensive class for making HTTP requests in Kotlin
 * Supports GET, POST, PUT, DELETE with JSON and form data
 */
class NetworkManager {
    
    companion object {
        private const val TIMEOUT_CONNECTION = 10000 // 10 seconds
        private const val TIMEOUT_READ = 15000 // 15 seconds
        private const val CHARSET = "UTF-8"
    }
    
    /**
     * Data class for network responses
     */
    data class NetworkResponse(
        val statusCode: Int,
        val data: String,
        val isSuccess: Boolean,
        val errorMessage: String? = null
    )
    
    /**
     * Enum for HTTP methods
     */
    enum class HttpMethod {
        GET, POST, PUT, DELETE
    }
    
    /**
     * Interface for network callbacks
     */
    interface NetworkCallback {
        fun onSuccess(response: NetworkResponse)
        fun onError(error: NetworkResponse)
    }
    
    /**
     * Make a GET request
     */
    suspend fun get(
        url: String,
        headers: Map<String, String> = emptyMap()
    ): NetworkResponse {
        return makeRequest(url, HttpMethod.GET, headers = headers)
    }
    
    /**
     * Make a POST request with JSON data
     */
    suspend fun postJson(
        url: String,
        jsonData: JSONObject,
        headers: Map<String, String> = emptyMap()
    ): NetworkResponse {
        val defaultHeaders = headers.toMutableMap()
        defaultHeaders["Content-Type"] = "application/json"
        return makeRequest(url, HttpMethod.POST, jsonData.toString(), defaultHeaders)
    }
    
    /**
     * Make a POST request with form data
     */
    suspend fun postForm(
        url: String,
        formData: Map<String, String>,
        headers: Map<String, String> = emptyMap()
    ): NetworkResponse {
        val defaultHeaders = headers.toMutableMap()
        defaultHeaders["Content-Type"] = "application/x-www-form-urlencoded"
        val encodedData = encodeFormData(formData)
        return makeRequest(url, HttpMethod.POST, encodedData, defaultHeaders)
    }
    
    /**
     * Make a PUT request with JSON data
     */
    suspend fun putJson(
        url: String,
        jsonData: JSONObject,
        headers: Map<String, String> = emptyMap()
    ): NetworkResponse {
        val defaultHeaders = headers.toMutableMap()
        defaultHeaders["Content-Type"] = "application/json"
        return makeRequest(url, HttpMethod.PUT, jsonData.toString(), defaultHeaders)
    }
    
    /**
     * Make a DELETE request
     */
    suspend fun delete(
        url: String,
        headers: Map<String, String> = emptyMap()
    ): NetworkResponse {
        return makeRequest(url, HttpMethod.DELETE, headers = headers)
    }
    
    /**
     * Make request with callback (non-coroutine version)
     */
    fun makeRequestWithCallback(
        url: String,
        method: HttpMethod,
        data: String? = null,
        headers: Map<String, String> = emptyMap(),
        callback: NetworkCallback
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = makeRequest(url, method, data, headers)
                withContext(Dispatchers.Main) {
                    if (response.isSuccess) {
                        callback.onSuccess(response)
                    } else {
                        callback.onError(response)
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    callback.onError(
                        NetworkResponse(
                            statusCode = -1,
                            data = "",
                            isSuccess = false,
                            errorMessage = e.message
                        )
                    )
                }
            }
        }
    }
    
    /**
     * Core method to make HTTP requests
     */
    private suspend fun makeRequest(
        url: String,
        method: HttpMethod,
        data: String? = null,
        headers: Map<String, String> = emptyMap()
    ): NetworkResponse = withContext(Dispatchers.IO) {
        
        var connection: HttpURLConnection? = null
        try {
            // Create connection
            connection = URL(url).openConnection() as HttpURLConnection
            
            // Set timeouts
            connection.connectTimeout = TIMEOUT_CONNECTION
            connection.readTimeout = TIMEOUT_READ
            
            // Set method
            connection.requestMethod = method.name
            
            // Set headers
            headers.forEach { (key, value) ->
                connection.setRequestProperty(key, value)
            }
            
            // Set default headers
            connection.setRequestProperty("User-Agent", "Android-NetworkManager/1.0")
            
            // Handle request body for POST/PUT
            if ((method == HttpMethod.POST || method == HttpMethod.PUT) && data != null) {
                connection.doOutput = true
                connection.outputStream.use { outputStream ->
                    outputStream.write(data.toByteArray(charset(CHARSET)))
                    outputStream.flush()
                }
            }
            
            // Get response
            val responseCode = connection.responseCode
            val isSuccess = responseCode in 200..299
            
            val responseData = if (isSuccess) {
                connection.inputStream.use { inputStream ->
                    inputStream.bufferedReader(charset(CHARSET)).readText()
                }
            } else {
                connection.errorStream?.use { errorStream ->
                    errorStream.bufferedReader(charset(CHARSET)).readText()
                } ?: "HTTP Error $responseCode"
            }
            
            NetworkResponse(
                statusCode = responseCode,
                data = responseData,
                isSuccess = isSuccess,
                errorMessage = if (!isSuccess) "HTTP Error $responseCode" else null
            )
            
        } catch (e: Exception) {
            NetworkResponse(
                statusCode = -1,
                data = "",
                isSuccess = false,
                errorMessage = e.message ?: "Unknown error occurred"
            )
        } finally {
            connection?.disconnect()
        }
    }
    
    /**
     * Encode form data for POST requests
     */
    private fun encodeFormData(formData: Map<String, String>): String {
        return formData.entries.joinToString("&") { (key, value) ->
            "${URLEncoder.encode(key, CHARSET)}=${URLEncoder.encode(value, CHARSET)}"
        }
    }
    
    /**
     * Parse JSON response safely
     */
    fun parseJsonResponse(response: NetworkResponse): JSONObject? {
        if (!response.isSuccess) return null
        
        return try {
            JSONObject(response.data)
        } catch (e: JSONException) {
            null
        }
    }
    
    /**
     * Check if device has internet connection
     */
    fun isNetworkAvailable(): Boolean {
        return try {
            val connection = URL("https://www.google.com").openConnection()
            connection.connectTimeout = 3000
            connection.connect()
            true
        } catch (e: Exception) {
            false
        }
    }
}

// Usage Examples:

/*
class MainActivity : AppCompatActivity() {
    private val networkManager = NetworkManager()

    private fun exampleUsage() {
        // Example 1: GET request with coroutines
        lifecycleScope.launch {
            try {
                val response = networkManager.get("https://api.example.com/users")
                if (response.isSuccess) {
                    val jsonData = networkManager.parseJsonResponse(response)
                    // Handle successful response
                    Log.d("Network", "Data: ${response.data}")
                } else {
                    // Handle error
                    Log.e("Network", "Error: ${response.errorMessage}")
                }
            } catch (e: Exception) {
                Log.e("Network", "Exception: ${e.message}")
            }
        }

        // Example 2: POST JSON request
        lifecycleScope.launch {
            val jsonData = JSONObject().apply {
                put("name", "John Doe")
                put("email", "john@example.com")
            }

            val headers = mapOf(
                "Authorization" to "Bearer your-token-here",
                "Accept" to "application/json"
            )

            val response = networkManager.postJson(
                "https://api.example.com/users",
                jsonData,
                headers
            )

            if (response.isSuccess) {
                // Handle success
                Toast.makeText(this@MainActivity, "User created!", Toast.LENGTH_SHORT).show()
            }
        }

        // Example 3: POST form data
        lifecycleScope.launch {
            val formData = mapOf(
                "username" to "john_doe",
                "password" to "password123"
            )

            val response = networkManager.postForm("https://api.example.com/login", formData)
            // Handle response...
        }

        // Example 4: Using callbacks (non-coroutine)
        val callback = object : NetworkManager.NetworkCallback {
            override fun onSuccess(response: NetworkManager.NetworkResponse) {
                // This runs on main thread
                Toast.makeText(this@MainActivity, "Success!", Toast.LENGTH_SHORT).show()
            }

            override fun onError(error: NetworkManager.NetworkResponse) {
                // This runs on main thread
                Toast.makeText(this@MainActivity, "Error: ${error.errorMessage}", Toast.LENGTH_SHORT).show()
            }
        }

        networkManager.makeRequestWithCallback(
            "https://api.example.com/data",
            NetworkManager.HttpMethod.GET,
            callback = callback
        )

        // Example 5: Check network availability
        if (networkManager.isNetworkAvailable()) {
            // Make network request
        } else {
            Toast.makeText(this, "No internet connection", Toast.LENGTH_SHORT).show()
        }
    }
}
*/