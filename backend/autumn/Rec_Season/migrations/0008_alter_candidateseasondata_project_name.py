# Generated by Django 4.1 on 2022-10-11 17:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0007_alter_project_marks_alter_project_remarks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidateseasondata',
            name='project_name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Rec_Season.project'),
        ),
    ]
