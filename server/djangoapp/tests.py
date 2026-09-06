from django.test import TestCase, Client


class BasicPageTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_about_page_loads(self):
        response = self.client.get("/about/")
        self.assertEqual(response.status_code, 200)

    def test_contact_page_loads(self):
        response = self.client.get("/contact/")
        self.assertEqual(response.status_code, 200)

    def test_index_page_loads(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
