// Formal class-to-route mapping confirmed for parent day. This contains no
// geometry; routes.js remains the sole source for route segments and transitions.
const assign = (routeId, classIds) => classIds.map((classId) => [`classroom-${classId}`, routeId])

export const classRouteMap = Object.freeze(Object.fromEntries([
  ...assign('ppt-start-to-b-wing-1f-access', ['701', '702']),
  ...assign('ppt-start-to-a-wing-2f-access', ['916', '917', '918', '919']),
  ...assign('ppt-start-to-b-wing-2f-access', ['703', '704', '705']),
  ...assign('ppt-start-to-c-wing-2f-access', ['801', '802', '803', '804', '805']),
  ...assign('ppt-start-to-a-wing-3f-access', ['911', '912', '913', '914', '915']),
  ...assign('ppt-start-to-b-wing-3f-access', ['706', '707', '708', '709']),
  ...assign('ppt-start-to-c-wing-3f-access', ['806', '807', '808', '809', '810']),
  ...assign('ppt-start-to-a-wing-4f-access', ['906', '907', '908', '909', '910']),
  ...assign('ppt-start-to-b-wing-4f-access', ['710', '711', '712', '714']),
  ...assign('ppt-start-to-c-wing-4f-access', ['811', '812', '813', '814']),
  ...assign('ppt-start-to-a-wing-5f-access', ['901', '902', '903', '904', '905']),
  ...assign('ppt-start-to-b-wing-5f-access', ['713', '715']),
  ...assign('ppt-start-to-c-wing-5f-access', ['815', '816']),
]))

export const findRouteIdForClass = (classDestinationId) => classRouteMap[classDestinationId] ?? null
