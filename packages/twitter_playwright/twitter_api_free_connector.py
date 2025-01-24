import os
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()

# Add this at the top level of the file
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATE_FILE = os.path.join(SCRIPT_DIR, "state.json")

def login_and_save_state(username, password, phone_or_username, storage_path=STATE_FILE):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=1000) # delay for 1 second for all actions
        context = browser.new_context()
        page = context.new_page()

        # 1) Navigate to login
        page.goto("https://x.com/login")
        page.wait_for_timeout(1000) # optional

        # 2) Fill in username & password (this is just an example, update selectors as needed)
        page.wait_for_selector('input[name="text"]', timeout=10000)
        page.fill('input[name="text"]', username)
        # page.click('div:has-text("Next")')
        page.keyboard.press("Enter")     
        
        # Check for unusual activity or direct password prompt
        try:
            # Wait briefly to see which page we land on
            page.wait_for_timeout(2000)
            
            # Try to detect which input field appears
            unusual_activity = page.locator('input[data-testid="ocfEnterTextTextInput"]')
            password_field = page.locator('input[name="password"]')
            
            if unusual_activity.is_visible(timeout=3000):
                print("[INFO] Unusual login activity popup detected.")
                unusual_activity.fill(phone_or_username)
                page.keyboard.press("Enter")
                page.wait_for_load_state("networkidle")
                print("[INFO] Challenge response submitted.")
            elif password_field.is_visible(timeout=3000):
                print("[INFO] Direct password prompt detected.")
            else:
                print("[INFO] Unable to detect next step. Please check the page state.")

        except Exception as e:
            print(f"[INFO] Exception during flow detection: {str(e)}. Attempting to continue.")

        # Password
        page.wait_for_selector('input[name="password"]', timeout=10000)
        page.fill('input[name="password"]', password)
        # page.click('div:has-text("Log in")')
        page.keyboard.press("Enter")

        # 3) Wait until the user is on the home feed
        page.wait_for_url(lambda url: "home" in url, timeout=15000)
        print("[INFO] Logged in successfully (assuming no extra checks).")

        # 4) Save the current browser context's storage state to a file
        context.storage_state(path=storage_path)
        print(f"[INFO] Storage state saved to {storage_path}.")

        browser.close()

def post_tweet_with_saved_state(tweet_text, storage_path=STATE_FILE):
    with sync_playwright() as p:
        # Create a new context with the previously saved state
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(storage_state=storage_path)
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


def main(tweet_content):
    # Test post
    X_POST_TEXT = tweet_content

    # check if state.json exist
    if os.path.exists(STATE_FILE):
        print(f"[INFO] state.json exists at {STATE_FILE}. Using existing state.")
    else:
        print(f"[INFO] state.json does not exist at {STATE_FILE}. Logging in and saving state.")

        login_and_save_state(
            username=os.getenv("X_EMAIL"),
            password=os.getenv("X_PASSWORD"),
            phone_or_username=os.getenv("X_PHONE_OR_USERNAME"),
            storage_path=STATE_FILE
        )

    post_tweet_with_saved_state(
        tweet_text=X_POST_TEXT,
        storage_path=STATE_FILE
    )

if __name__ == "__main__":
    main("Hello")