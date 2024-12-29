from models.gemini_model import GeminiModel
import step_1 as next_step
import yaml
import schedule
import time
import threading
import argparse
import post_manager as twitter_manager

# open the tracker file
with open('configs/ZorpTheAlien/tracker.yaml', 'r', encoding='utf-8') as f:
    tracker_data = yaml.safe_load(f)

# get the post_every_x_minutes value from the tracker file
post_every_x_minutes = tracker_data['post_every_x_minutes'] 

# Schedule the post_to_twitter function to run every minute, for example:
post_manager = twitter_manager.PostManager()

# create a schedule to post to twitter every minute
# schedule.every(post_every_x_minutes).minutes.do(post_manager.post_to_twitter)
schedule.every(5).seconds.do(post_manager.post_to_twitter)

# run the scheduler
def run_scheduler():
    """ Continuously run the scheduler in a loop """
    global scheduler_running
    scheduler_running = True
    while scheduler_running:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--run-time', type=int, default=0, 
                       help='How many minutes to run (0 for indefinite)')
    args = parser.parse_args()

    # Instantiate your AI model
    ai_model = GeminiModel()

    # Start the scheduler in a separate thread
    # scheduler_thread = threading.Thread(target=run_scheduler)
    # scheduler_thread.start()

    if args.run_time > 0:
        time.sleep(args.run_time * 60)
        scheduler_running = False
    else:
        # Run indefinitely until interrupted with menu options
        try:
            while True:
                print("\n=== Bot Control Menu ===")
                print("1. Check posting status")
                print("2. Force post now")
                print("3. Pause posting")
                print("4. Resume posting")
                print("5. Exit")
                
                choice = input("\nEnter your choice (1-5): ")
                
                if choice == '1':
                    print(f"Posting schedule: Every {post_every_x_minutes} minutes")
                    print(f"Scheduler is {'running' if scheduler_running else 'paused'}")
                elif choice == '2':
                    print("Forcing a post now...")
                    post_manager.post_to_twitter()
                elif choice == '3':
                    scheduler_running = False
                    print("Posting has been paused")
                elif choice == '4':
                    scheduler_running = True
                    print("Posting has been resumed")
                elif choice == '5':
                    print("Shutting down...")
                    scheduler_running = False
                    break
                else:
                    print("Invalid choice. Please try again.")
                
                time.sleep(1)
        except KeyboardInterrupt:
            scheduler_running = False
