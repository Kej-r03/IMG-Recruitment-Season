from rest_framework.permissions import BasePermission

class isNot2ndYear(BasePermission):
    message="Permission Denied"

    def has_object_permission(self, request, view,obj):
        if obj.year_in_season==2: #2nd yearites cannot access candidate scores
            return False
        
        return True