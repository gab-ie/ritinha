from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.TextChoices):
    RECEPTION = "recepcao", "Recepção"
    NURSING = "enfermagem", "Enfermagem"
    PHYSICIAN = "medico", "Médico"
    ADMINISTRATION = "admin", "Administração"


class User(AbstractUser):
    role = models.CharField(max_length=16, choices=Role.choices, blank=True, default="")

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(role__in=["", *Role.values]),
                name="accounts_user_valid_role",
            ),
        ]
