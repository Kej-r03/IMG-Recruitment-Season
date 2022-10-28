# Generated by Django 4.1 on 2022-10-18 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0011_remove_interviewresponse_section_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidateseasondata',
            name='status',
            field=models.CharField(choices=[('IP', 'In Process'), ('S', 'Selected')], max_length=20),
        ),
        migrations.AlterField(
            model_name='interview',
            name='status',
            field=models.CharField(choices=[('C', 'Called'), ('N', 'Not Called'), ('O', 'Ongoing'), ('W', 'Waiting'), ('D', 'Done')], max_length=10),
        ),
    ]
