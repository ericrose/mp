from django.db import models
from datetime import timedelta

class Marathon(models.Model):
	mp = models.IntegerField()
	marathon_date = models.DateField()
