#include "raylib.h"
#include "raymath.h"
#include <stddef.h>
#include <time.h>


// Window
#define WINDOW_WIDTH 1920
#define WINDOW_HEIGHT 1080
#define RESOLUTION (Vector2){.x = (float)WINDOW_WIDTH, .y = (float)WINDOW_HEIGHT}
#define TARGET_FPS 60

#define COLORS_LENGTH (sizeof(colors) / sizeof(colors[0]))

static Color colors[] = {
{245, 224, 220, 255}, // Rosewater
{242, 205, 205, 255}, // Flamingo
{245, 194, 231, 255}, // Pink
{203, 166, 247, 255}, // Mauve
{243, 139, 168, 255}, // Red
{250, 179, 135, 255}, // Peach
{249, 226, 175, 255}, // Yellow
{166, 227, 161, 255}, // Green
{148, 226, 213, 255}, // Teal
{137, 180, 250, 255}  // Blue
};

void normalizedColorsToFloatVec4(float* vec4) {
	for (size_t i = 0; i < COLORS_LENGTH; ++i) {
		vec4[i * 4] = colors[i].r / 255.0f;
		vec4[i * 4 + 1] = colors[i].g / 255.0f;
		vec4[i * 4 + 2] = colors[i].b / 255.0f;
		vec4[i * 4 + 3] = colors[i].a / 255.0f;
	}
}

int main(void) {
	InitWindow(WINDOW_WIDTH, WINDOW_HEIGHT, "RLGL Template");	
	SetTargetFPS(TARGET_FPS);

	// color palette as vec4 needed for shaders
	float color_palette_vec[COLORS_LENGTH * 4];
	normalizedColorsToFloatVec4(color_palette_vec);

	// set up shaders
	Shader main_shader = LoadShader("main.vert", "main.frag");

	int main_shader_colors_loc = GetShaderLocation(main_shader, "colors"); 
	int main_shader_time_loc = GetShaderLocation(main_shader, "time");
	int main_shader_resolution_loc = GetShaderLocation(main_shader, "resolution");

	SetShaderValueV(main_shader, main_shader_colors_loc, &color_palette_vec, SHADER_UNIFORM_VEC4, COLORS_LENGTH);
	SetShaderValue(main_shader, main_shader_resolution_loc, &RESOLUTION, SHADER_UNIFORM_VEC2);

	RenderTexture2D main_target = LoadRenderTexture(WINDOW_WIDTH, WINDOW_HEIGHT);

	while (!WindowShouldClose()) {
		float elapsed_time = GetTime();
		SetShaderValue(main_shader, main_shader_time_loc, &elapsed_time, SHADER_UNIFORM_FLOAT);

		BeginTextureMode(main_target);
		    ClearBackground(BLACK);
		    BeginShaderMode(main_shader);
		    DrawRectangle(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT, WHITE);
		    EndShaderMode();
		EndTextureMode();
		BeginDrawing();

			ClearBackground(BLACK);

			DrawTexturePro(
			main_target.texture,
			(Rectangle){ 0, 0, (float)main_target.texture.width, (float)main_target.texture.height },
			(Rectangle){ 0, 0, (float)WINDOW_WIDTH, (float)WINDOW_HEIGHT},
			(Vector2){ 0, 0 },
			0.0f,
			WHITE
			);

		DrawText(TextFormat("FPS: %d", GetFPS()), 10, 10, 20, BLACK);
		DrawText(TextFormat("Frametime: %.2fms", GetFrameTime() * 1000), 10, 30, 20, BLACK);

		EndDrawing();
	}

	
	UnloadRenderTexture(main_target);
	UnloadShader(main_shader);
	CloseWindow();
	return 0;
}
