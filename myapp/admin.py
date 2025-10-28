from django.contrib import admin
from .models import ContactMessage, Skill, Project, Experience

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    readonly_fields = ('created_at',)
    search_fields = ('name', 'email', 'phone', 'message')


admin.site.register(Skill)
admin.site.register(Project)
admin.site.register(Experience)