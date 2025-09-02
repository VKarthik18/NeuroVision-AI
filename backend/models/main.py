from threading import Thread
from rnn.api import app_rnn
from cnn.api import app_cnn

def run_rnn():
    # Disable reloader
    app_rnn.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)

def run_cnn():
    # Disable reloader
    app_cnn.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)

if __name__ == "__main__":
    Thread(target=run_rnn).start()
    Thread(target=run_cnn).start()
