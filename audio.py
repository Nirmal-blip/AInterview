import pyaudio
import wave
import requests

# Function to record audio
def record_audio(filename="recorded_audio.wav", duration=10, channels=1, rate=44100, chunk=1024):
    """
    Records audio for a specified duration and saves it to a .wav file.
    """
    audio = pyaudio.PyAudio()

    # Open the audio stream
    stream = audio.open(format=pyaudio.paInt16,
                        channels=channels,
                        rate=rate,
                        input=True,
                        frames_per_buffer=chunk)

    print(f"Recording for {duration} seconds...")
    frames = []

    # Record audio for the specified duration
    for _ in range(0, int(rate / chunk * duration)):
        data = stream.read(chunk)
        frames.append(data)

    print("Recording complete.")

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    audio.terminate()

    # Save the audio to a WAV file
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
        wf.setframerate(rate)
        wf.writeframes(b''.join(frames))

    print(f"Audio saved to {filename}.")
    return filename

# Function to send the recorded audio to the FastAPI API
def send_audio_to_api(api_url, audio_file):
    """
    Sends the recorded audio file to the API for transcription.
    """
    try:
        print(f"Sending {audio_file} to {api_url}...")
        with open(audio_file, "rb") as f:
            files = {"file": f}
            response = requests.post(api_url, files=files)

        if response.status_code == 200:
            transcription = response.json().get("transcription", "No transcription found.")
            print("Transcription:", transcription)
        else:
            print(f"Error: Received status code {response.status_code}")
            print("Response:", response.text)

    except Exception as e:
        print(f"An error occurred: {e}")

# Main function
if __name__ == "__main__":
    # Configuration
    API_URL = "http://127.0.0.1:8000/transcribe/"  # Replace with your FastAPI endpoint
    FILENAME = "recorded_audio.wav"               # Output file name
    DURATION = 5                                  # Recording duration in seconds

    # Record audio and send it to the API
    audio_file = record_audio(filename=FILENAME, duration=DURATION)
    send_audio_to_api(API_URL, audio_file)
