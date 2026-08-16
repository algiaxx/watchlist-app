import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Media",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("type", models.CharField(choices=[("MOVIE", "Movie"), ("TV", "TV Show")], default="MOVIE", max_length=10)),
                ("status", models.CharField(choices=[("WATCHED", "Watched"), ("UNWATCHED", "Unwatched")], default="UNWATCHED", max_length=10)),
                ("rating", models.PositiveSmallIntegerField(blank=True, help_text="1 to 5 stars, only meaningful once watched.", null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="media_items", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
