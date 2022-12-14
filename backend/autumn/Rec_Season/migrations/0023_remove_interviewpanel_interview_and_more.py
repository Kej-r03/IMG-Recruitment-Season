# Generated by Django 4.1 on 2022-11-23 12:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0022_alter_evaluation_marks_alter_evaluation_remarks_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='interviewpanel',
            name='interview',
        ),
        migrations.AddField(
            model_name='interview',
            name='interviewers',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='interview',
            name='panel',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Rec_Season.interviewpanel'),
        ),
    ]
