from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.email}"

class Skill(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    icon_class = models.CharField(max_length=100, blank=True, null=True)  # For Font Awesome icons
    image_url = models.URLField(blank=True, null=True)  # For SVG logos like Django
    delay = models.FloatField(default=0)  # Animation delay

    def __str__(self):
        return self.name


# models.py
class Project(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=150)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    tech_stack = models.CharField(max_length=200)  # e.g. "HTML5,CSS,JS,Django"
    live_demo_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    delay = models.FloatField(default=0)

    def tech_list(self):
        return [tech.strip() for tech in self.tech_stack.split(',')]  # split into list

    def __str__(self):
        return self.name



class Experience(models.Model):
    role = models.CharField(max_length=100)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=50)  # e.g., "2023" or "Jan 2023 - Dec 2023"
    description = models.TextField()
    responsibilities = models.TextField(help_text="Separate each responsibility with a comma")
    tech_stack = models.CharField(max_length=200, help_text="Comma-separated tech stack")
    icon_class = models.CharField(max_length=100, default="fas fa-laptop-code")  # FontAwesome
    delay = models.FloatField(default=0)

    def responsibilities_list(self):
        return [r.strip() for r in self.responsibilities.split(',')]

    def tech_list(self):
        return [t.strip() for t in self.tech_stack.split(',')]

    def __str__(self):
        return f"{self.role} at {self.company}"
