package it.orbyta.welloffice.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class WellViewModelFactory() : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (
            modelClass.isAssignableFrom(WellViewModel::class.java)
        ) {
            return WellViewModel() as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}