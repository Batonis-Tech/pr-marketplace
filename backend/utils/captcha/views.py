import requests
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from Backend import settings
from utils.utils import get_client_ip


class Submission(APIView):
    def post(self, request, *args, **kwargs):
        print(f'>>>>> {request.data["g-recaptcha-response"]}')
        r = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': settings.CAPTCHA_SECRET_KEY,
                'response': request.data['g-recaptcha-response'],
                # 'remoteip': get_client_ip(self.request),  # Optional
            }
        )
        print(r.json())
        if r.json()['success']:
            # Successfuly validated
            # Handle the submission, with confidence!
            # return self.create(request, *args, **kwargs)
            return Response(data={'message': 'ReCAPTCHA verified.'}, status=status.HTTP_200_OK)

        # Error while verifying the captcha
        return Response(data={'error': 'ReCAPTCHA not verified.'}, status=status.HTTP_406_NOT_ACCEPTABLE)
