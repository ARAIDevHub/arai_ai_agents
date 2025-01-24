from playwright.sync_api import sync_playwright
import os
from dotenv import load_dotenv
from pathlib import Path

def ensure_state_folder():
    """Create state folder if it doesn't exist"""
    state_folder = Path("state")
    state_folder.mkdir(exist_ok=True)
    return state_folder

def get_state_path():
    """Get the full path to the login state file"""
    return Path("state/login_state.json")

def login_and_save_state(username, password, phone_or_email, storage_path=None):
    if storage_path is None:
        storage_path = get_state_path()
    
    with sync_playwright() as p:
        # Ensure state folder exists
        ensure_state_folder()

        # If we already have a state file, we can return True
        if storage_path.exists():
            print(f"[login_and_save_state] {storage_path} exists. Using existing state.")
            return True

        browser = p.chromium.launch(headless=False, slow_mo=1000)
        context = browser.new_context()
        page = context.new_page()

        # 1) Navigate to login
        page.goto("https://x.com/login")
        page.wait_for_timeout(1000)

        # 2) Fill in username
        print(f"[login_and_save_state] - filling in username")
        page.wait_for_selector('input[name="text"]', timeout=10000)
        page.fill('input[name="text"]', username)
        page.keyboard.press("Enter")     

        try:
            # Attempt normal login flow
            print(f"[login_and_save_state] - attempting normal login flow")
            page.wait_for_selector('input[name="password"]', timeout=5000)  # reduced from 10000
            page.fill('input[name="password"]', password)
            page.keyboard.press("Enter")

            # Wait for successful login
            print(f"[login_and_save_state] - waiting for home page")
            page.wait_for_url(lambda url: "home" in url, timeout=5000)
            print("[INFO] Logged in successfully through normal flow.")

        except:
            print(f"[INFO] Normal login failed: Checking for unusual activity...")

            try:
                # Check for unusual activity challenge
                print(f"[login_and_save_state] - looking for unusual activity challenge")
                page.wait_for_selector('input[data-testid="ocfEnterTextTextInput"]', timeout=3000)
                print("[INFO] Unusual login activity popup detected.")

                # Fill in phone or username
                page.fill('input[data-testid="ocfEnterTextTextInput"]', phone_or_email)
                page.keyboard.press("Enter")
                page.wait_for_load_state("networkidle")
                print("[INFO] Challenge response submitted.")

                # Enter password again after challenge
                print(f"[login_and_save_state] - entering password after challenge")
                page.wait_for_selector('input[name="password"]', timeout=5000)
                page.fill('input[name="password"]', password)
                page.keyboard.press("Enter")

                # Wait for successful login after challenge
                print(f"[login_and_save_state] - waiting for home page after challenge")
                page.wait_for_url(lambda url: "home" in url, timeout=5000)
                print("[INFO] Logged in successfully after challenge.")

            except:
                print("[ERROR] Login failed - unusual activity flow could not be completed.")
                browser.close()
                return False

        # Save the current browser context's storage state to a file
        context.storage_state(path=str(storage_path))
        print(f"[INFO] Storage state saved to {storage_path}.")

        browser.close()
        return True

def post_tweet_with_saved_state(tweet_text, storage_path=None):
    if storage_path is None:
        storage_path = get_state_path()
        
    with sync_playwright() as p:
        # Create a new context with the previously saved state
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(storage_state=str(storage_path))
        page = context.new_page()

        # Now page is already logged in if state.json is still valid
        page.goto("https://x.com/home")
        # Wait a bit for the home feed to render
        page.wait_for_timeout(1000) # optional
        # page.wait_for_load_state("networkidle")
        print("[INFO] Checking if we are indeed logged in...")

        # Post a tweet
        tweet_box_selector = 'div[data-testid="tweetTextarea_0"]'
        page.wait_for_selector(tweet_box_selector, timeout=10000)
        page.fill(tweet_box_selector, tweet_text)

        # post_button_selector = 'div[data-testid="tweetButtonInline"]'
        post_button_selector = 'button[data-testid="tweetButtonInline"]'
        # page.wait_for_selector(post_button_selector, state="visible", timeout=20000)  # Wait for visible

        page.wait_for_selector(post_button_selector, timeout=10000)
        page.click(post_button_selector)
        page.wait_for_timeout(3000)
        print("[INFO] Tweet posted (assuming no errors).")

        browser.close()

if __name__ == "__main__":
    """
    Example usage. Replace the placeholders with your real credentials.
    'phone_or_username' is used if the suspicious activity screen appears
    asking you to confirm via phone or username.
    """
    load_dotenv()
    
    # Test post
    X_POST_TEXT = "Hello"

    # Ensure state folder exists and get state file path
    state_path = get_state_path()

    # check if login state exists
    if state_path.exists():
        print(f"[INFO] {state_path} exists. Using existing state.")
    else:
        print(f"[INFO] {state_path} does not exist. Logging in and saving state.")
        login_and_save_state(
            username=os.getenv("X_USERNAME"),
            password=os.getenv("X_PASSWORD"),
            phone_or_email=os.getenv("X_PHONE_OR_EMAIL"),
            storage_path=state_path
        )

    post_tweet_with_saved_state(
        tweet_text=X_POST_TEXT,
        storage_path=state_path
    )
