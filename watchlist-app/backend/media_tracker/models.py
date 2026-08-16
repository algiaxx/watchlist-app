from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Media(models.Model):
    class MediaType(models.TextChoices):
        MOVIE = "MOVIE", "Movie"
        TV = "TV", "TV Show"

    class Status(models.TextChoices):
        WATCHED = "WATCHED", "Watched"
        UNWATCHED = "UNWATCHED", "Unwatched"

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=MediaType.choices, default=MediaType.MOVIE)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.UNWATCHED)
    rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="1 to 5 stars, only meaningful once watched.",
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="media_items"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.get_type_display()})"
