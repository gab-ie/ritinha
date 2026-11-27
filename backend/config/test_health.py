from django.test import SimpleTestCase
from django.urls import reverse


class HealthEndpointTests(SimpleTestCase):
    def test_anonymous_get_returns_ok_without_database_access(self):
        response = self.client.get(reverse("api-health"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_post_is_not_allowed(self):
        response = self.client.post(reverse("api-health"))

        self.assertEqual(response.status_code, 405)
