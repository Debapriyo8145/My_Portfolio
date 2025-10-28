from django.shortcuts import render
from django.http import JsonResponse
from .models import ContactMessage, Skill, Project, Experience

# Create your views here.
def home(request):
    skills = Skill.objects.all().order_by('id')
    projects = Project.objects.all().order_by('id') 
    experiences = Experience.objects.all().order_by('id') 
    return render(request, 'myapp/home.html', {
        'skills': skills,
        'projects': projects,
        'experiences': experiences
    })


def contact_submit(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message = request.POST.get('message')

        # Save the message into the database
        ContactMessage.objects.create(
            name=name,
            email=email,
            phone=phone,
            message=message
        )
        # Respond with JSON for JS popup
        return JsonResponse({'success': True, 'message': 'Message sent successfully!'})

    return JsonResponse({'success': False, 'message': 'Invalid request method'})

from django.contrib.auth.decorators import login_required


def message_list(request):
    messages = ContactMessage.objects.all()
    return render(request, 'myapp/message_list.html', {'messages': messages})
