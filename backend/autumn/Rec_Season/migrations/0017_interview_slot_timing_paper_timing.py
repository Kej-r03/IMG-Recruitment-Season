# Generated by Django 4.1 on 2022-10-23 07:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0016_remove_interview_slot_timing'),
    ]

    operations = [
        migrations.AddField(
            model_name='interview',
            name='slot_timing',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='paper',
            name='timing',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
