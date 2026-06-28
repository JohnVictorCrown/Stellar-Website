package jv.stellariumcaller.stellariumcaller.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = AccentBlue,
    secondary = AccentPurple,
    tertiary = AccentPink,
    background = DarkBackground,
    surface = DarkSurface,
    surfaceVariant = DarkSurfaceVariant,
    onPrimary = White,
    onSecondary = White,
    onBackground = White,
    onSurface = White,
    onSurfaceVariant = GrayLight,
    error = Red,
    onError = White,
)

@Composable
fun StellariumCallerTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
