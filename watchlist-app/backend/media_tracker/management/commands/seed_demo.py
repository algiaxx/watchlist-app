from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from media_tracker.models import Media


class Command(BaseCommand):
    help = "Creates a demo user and seeds sample watchlist items."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="demo")
        parser.add_argument("--password", default="demopass123")

    def handle(self, *args, **options):
        username = options["username"]
        password = options["password"]

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": f"{username}@example.com", "is_staff": True, "is_superuser": True},
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created user '{username}' / '{password}'"))
        else:
            self.stdout.write(f"User '{username}' already exists, reusing it.")

        if Media.objects.filter(owner=user).exists():
            self.stdout.write("Demo media already seeded for this user, skipping.")
            return

        seed_items = [
            {"title": "Dune: Part Two", "type": "MOVIE", "status": "WATCHED", "rating": 5},
            {"title": "The Bear", "type": "TV", "status": "WATCHED", "rating": 4},
            {"title": "Severance", "type": "TV", "status": "UNWATCHED", "rating": None},
            {"title": "Oppenheimer", "type": "MOVIE", "status": "UNWATCHED", "rating": None},
            {"title": "The Last of Us", "type": "TV", "status": "UNWATCHED", "rating": None},
        ]
        for item in seed_items:
            Media.objects.create(owner=user, **item)

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(seed_items)} watchlist items for '{username}'."))