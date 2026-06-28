package jv.stellariumcaller.stellariumcaller.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

val DarkBackground = Color(0xFF0D0015)
val DarkSurface = Color(0xFF1A1A2E)
val DarkSurfaceVariant = Color(0xFF2A2A3E)

val AccentBlue = Color(0xFF4A90D9)
val AccentPurple = Color(0xFF9B59B6)
val AccentPink = Color(0xFFFF4081)
val AccentPurpleDark = Color(0xFF2A1A3E)
val AccentBlueDark = Color(0xFF1A2A4E)
val AccentPinkLight = Color(0xFFFF80AB)

val Red = Color(0xFFFF4444)
val White = Color(0xFFFFFFFF)
val GrayLight = Color(0xFFAAAAAA)
val GrayMedium = Color(0xFF888888)
val GrayDark = Color(0xFF666666)

val BackgroundGradient: Brush
    @Composable get() = Brush.verticalGradient(
        colors = listOf(Color(0xFF1A0033), DarkBackground, Color(0xFF001633))
    )
