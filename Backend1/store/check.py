from decouple import config
print(config("EMAIL_USER", default="Not set"))
print(config("EMAIL_PASSWORD", default="Not set"))
