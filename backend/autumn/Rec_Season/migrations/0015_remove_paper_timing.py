# Generated by Django 4.1 on 2022-10-23 07:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0014_alter_evaluation_marks_alter_evaluation_remarks'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='paper',
            name='timing',
        ),
    ]
