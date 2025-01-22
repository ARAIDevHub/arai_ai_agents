import requests
from requests.cookies import RequestsCookieJar
from http.cookies import SimpleCookie

def update_cookie_jar(cookie_jar: RequestsCookieJar, response: requests.Response):
    """
    Updates a cookie jar with the cookies from a response object.

    Args:
        cookie_jar: The cookie jar to update.
        response: The response object.
    """
    for set_cookie_header in response.headers.get_list("Set-Cookie"):
        simple_cookie = SimpleCookie()
        simple_cookie.load(set_cookie_header)
        for key, morsel in simple_cookie.items():
            cookie_jar.set(key, morsel.value, domain=morsel["domain"], path=morsel["path"])
