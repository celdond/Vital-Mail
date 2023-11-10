import pytest

@pytest.mark.usefixtures("driver_init")
class Test_Register():
    def test_title(self):
        self.driver.get("http://localhost:5173/")

        title = "Vital Mail"
        assert title == self.driver.title