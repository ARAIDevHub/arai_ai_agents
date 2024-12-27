from models.gemini_model import GeminiModel
import step_1 as next_step
import yaml
import schedule
import time
import threading
import keyboard
import post_manager as twitter_manager

# open the tracker file
with open('configs/ZorpTheAlien/tracker.yaml', 'r', encoding='utf-8') as f:
    tracker_data = yaml.safe_load(f)

# get the post_every_x_minutes value from the tracker file
post_every_x_minutes = tracker_data['post_every_x_minutes'] 

# Schedule the post_to_twitter function to run every minute, for example:
post_manager = twitter_manager.PostManager()

# create a schedule to post to twitter every minute
schedule.every(post_every_x_minutes).minutes.do(post_manager.post_to_twitter)

# run the scheduler
def run_scheduler():
    """ Continuously run the scheduler in a loop """
    global scheduler_running
    scheduler_running = True
    while scheduler_running:
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

    # quit the program when the delete key is pressed
    while True:
        if keyboard.is_pressed('delete'):
            print("Delete key pressed")
            # Set the flag to False to stop the scheduler
            global scheduler_running
            scheduler_running = False
            # Wait for the scheduler thread to finish
            scheduler_thread.join()
            break

    print("Program shutting down...")
