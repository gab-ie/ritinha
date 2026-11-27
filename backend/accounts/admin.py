from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class RitaUserAdmin(UserAdmin):
    fieldsets = (*UserAdmin.fieldsets, ("Sistema Rita", {"fields": ("role",)}))
    add_fieldsets = (*UserAdmin.add_fieldsets, ("Sistema Rita", {"fields": ("role",)}))
