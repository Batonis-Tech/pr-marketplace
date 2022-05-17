from rest_framework import serializers
from .models import Text
from django_quill.drf.fields import QuillHtmlField, QuillPlainField

class TextSerializer(serializers.ModelSerializer):
    # quill_content = QuillHtmlField()
    quill_content_plain = QuillPlainField(source='quill_content')
    class Meta:
        model = Text
        fields = "__all__"

    def to_representation(self, instance):
        data = super(TextSerializer, self).to_representation(instance)
        data['quill_content'] = instance.quill_content.quill.html
        data['quill_json'] = instance.quill_content.quill.json_string
        # data['images'] = ImageSerializer(many=True, instance=instance.images, context=self.context).data
        return data



class GetTextSerializer(serializers.Serializer):
    text_id = serializers.PrimaryKeyRelatedField(queryset=Text.objects.all())

