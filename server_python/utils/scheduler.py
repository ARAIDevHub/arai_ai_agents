# standard imports
import threading
import schedule
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AgentScheduler:
    def __init__(self):
        self.scheduler_running = False
        self.pause_event = threading.Event()
        self.scheduler_thread = None

    def run_scheduler(self):
        """Continuously run the scheduler in a loop"""
        while self.scheduler_running:
            if not self.pause_event.is_set():
                schedule.run_pending()
            time.sleep(1)

    def start(self):
        """Start the scheduler thread"""
        if not self.scheduler_thread or not self.scheduler_thread.is_alive():
            self.scheduler_running = True
            self.scheduler_thread = threading.Thread(target=self.run_scheduler)
            self.scheduler_thread.daemon = True
            self.scheduler_thread.start()

    def stop(self):
        """Stop the scheduler thread"""
        self.scheduler_running = False
        if self.scheduler_thread:
            self.scheduler_thread.join()

    def pause(self):
        """Pause the scheduler"""
        self.pause_event.set()

    def resume(self):
        """Resume the scheduler"""
        self.pause_event.clear()

    def is_paused(self):
        """Check if scheduler is paused"""
        return self.pause_event.is_set()

    def is_running(self):
        """Check if scheduler is running"""
        return self.scheduler_running and (self.scheduler_thread and self.scheduler_thread.is_alive())

    def schedule_posts(self, post_manager, tracker_data):
        """Schedule posts with special handling for first post"""

        # Schedule first post right away
        self.schedule_first_post(post_manager, tracker_data)

        # check what we to do the scheduler if all content is posted
        self.schedule_last_post(post_manager, tracker_data)
        
        # Schedule regular posts
        # Production schedule:
        if os.getenv("X_ENABLED") == "True":
            schedule.every(tracker_data.get('post_every_x_minutes')).minutes.do(post_manager.post_to_twitter)
        else:
            # Test schedule if you want to :
            schedule.every(5).seconds.do(post_manager.post_to_twitter)

    def schedule_first_post(self, post_manager, tracker_data):
        """Schedule posts with special handling for first post"""
        if (tracker_data['season_number'] == 0 and 
            tracker_data['episode_number'] == 0 and 
            tracker_data['post_number'] == 0):

            # Post immediately for first post of first episode/season
            post_manager.post_to_twitter()

    def schedule_last_post(self, post_manager, tracker_data):
        if (tracker_data['season_number'] == -1 and 
            tracker_data['episode_number'] == -1 and 
            tracker_data['post_number'] == -1):

            # check what we to do the scheduler if all content is posted
            self.check_generate_post_env(tracker_data)

    def check_generate_post_env(self, tracker_data):
        """Check what settings the auto generate posts is set to"""

        if os.getenv("AUTO_GENERATE_POSTS") == "AUTO":
            # generate new content
            # post_manager.create_content()

            # tracker_data['season_number'] = length seasons -1
            # tracker_data['episode_number'] = 0
            # tracker_data['post_number'] = 0
            self.stop()

        elif os.getenv("AUTO_GENERATE_POSTS") == "LOOP":
            tracker_data['season_number'] = 0
            tracker_data['episode_number'] = 0
            tracker_data['post_number'] = 0           

        elif os.getenv("AUTO_GENERATE_POSTS") == "STOP":
            self.stop()
        else:
            print("Auto generate posts is not set to a valid setting")
            print("Please set AUTO_GENERATE_POSTS to AUTO, LOOP, or STOP")
