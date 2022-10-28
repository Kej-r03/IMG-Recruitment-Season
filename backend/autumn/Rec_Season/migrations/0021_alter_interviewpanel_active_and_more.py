# Generated by Django 4.1 on 2022-10-26 06:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0020_interviewrounds_latest_interview_candidate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interviewpanel',
            name='active',
            field=models.CharField(choices=[('F', 'Free'), ('B', 'Busy'), ('I', 'Inactive')], max_length=1, null=True),
        ),
        migrations.AlterField(
            model_name='interviewpanel',
            name='location',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='interviewresponse',
            name='response',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Rec_Season.evaluation'),
        ),
    ]
