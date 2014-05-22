from django.shortcuts import render

def mp_dict(goal, factor=0, slower=1):
	target_pace = goal + (goal * slower * factor)
	
	return {'m': target_pace//60,
	        's': target_pace % 60}


def build_paces(request):
	if 'gt' in request.GET:
		goal_time = request.GET['gt']
	if 'd' in request.GET:
		marathon_date = request.GET['d']
	if not goal_time and marathon_date:
		error = "aw snap!"
	else:
		(hours, minutes, seconds) = goal_time.split(':')
		goal_spm = (3600 * int(hours) + 60 * int(minutes) + int(seconds))
		goal_pace = mp_dict(goal_spm)
		lr_upper = mp_dict(goal_spm, 0.2)
		lr_lower = mp_dict(goal_spm, 0.1)
		#medium long run is equivalent to long run upper bound
		ga_upper = mp_dict(goal_spm, 0.25)
		ga_lower = mp_dict(goal_spm, 0.15)
		lt = mp_dict(goal_spm, 0.05, -1)
		rec = mp_dict(goal_spm, 0.22)
		vo2_max = mp_dict(goal_spm, 0.13, -1)
