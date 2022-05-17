from django.db import models
from django_editorjs_fields import EditorJsJSONField
from django_quill.fields import QuillField


class Text(models.Model):
    name = models.CharField(max_length=250, unique=True)
    body = models.TextField(max_length=5000, blank=True, verbose_name="text_body")
    quill_content = QuillField(null=True)
    content = EditorJsJSONField(null=True, blank=True,
                                plugins=[
                                    "@editorjs/image",
                                    "@editorjs/header",
                                    "editorjs-github-gist-plugin",
                                    "@editorjs/code@2.6.0",  # version allowed :)
                                    "@editorjs/list@latest",
                                    "@editorjs/inline-code",
                                    "@editorjs/table",
                                ],
                                tools={
                                    "Gist": {
                                        "class": "Gist"  # Include the plugin class. See docs Editor.js plugins
                                    },
                                    "Image": {
                                        "config": {
                                            "endpoints": {
                                                "byFile": "/editorjs/image_upload/"
                                                # Your custom backend file uploader endpoint
                                            }
                                        }
                                    }
                                },
                                i18n={
                                    'messages': {
                                        'blockTunes': {
                                            "delete": {
                                                "Delete": "Удалить"
                                            },
                                            "moveUp": {
                                                "Move up": "Переместить вверх"
                                            },
                                            "moveDown": {
                                                "Move down": "Переместить вниз"
                                            }
                                        }
                                    },
                                }
                                )
    text_creature_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"

    def a(self):
        return self.quill_content.json_string

