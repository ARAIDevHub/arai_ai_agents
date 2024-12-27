from models.gemini_model import GeminiModel
import step_1 as next_step
import yaml
import schedule
import time
import threading
import keyboard
import post_manager as twitter_manager

# Schedule the post_to_twitter function to run every minute, for example:
post_manager = twitter_manager.PostManager()
schedule.every(1).minutes.do(post_manager.post_to_twitter)

def run_scheduler():
    """ Continuously run the scheduler in a loop """
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":

    # Instantiate your AI model
    ai_model = GeminiModel()

    '''
    # Menu system
    print("Welcome to AVA Agent.")
    print("Press Enter to continue...")
    while True:
        if keyboard.is_pressed('enter'):
            print("Enter key pressed")
            break                               

    print("Exiting...")
    '''

    # Start the scheduler in a separate thread
    scheduler_thread = threading.Thread(target=run_scheduler)
    scheduler_thread.start()


