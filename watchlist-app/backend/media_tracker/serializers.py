from rest_framework import serializers
from .models import Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ["id", "title", "type", "status", "rating", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_rating(self, value):
        if value is not None and not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate(self, attrs):
        # If the client sets a rating, treat the item as watched automatically.
        if attrs.get("rating") is not None:
            attrs["status"] = Media.Status.WATCHED
        return attrs
