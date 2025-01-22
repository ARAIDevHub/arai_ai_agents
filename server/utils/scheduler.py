# standard imports
import threading
import schedule
import time

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
