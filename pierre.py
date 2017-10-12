# state file generated using paraview version 5.4.1

# ----------------------------------------------------------------
# setup views used in the visualization
# ----------------------------------------------------------------

#### import the simple module from the paraview
from paraview.simple import *
#### disable automatic camera reset on 'Show'
paraview.simple._DisableFirstRenderCameraReset()

# Create a new 'Render View'
renderView1 = CreateView('RenderView')
renderView1.ViewSize = [915, 720]
renderView1.AxesGrid = 'GridAxes3DActor'
renderView1.CenterOfRotation = [249.5, 234.5, 101.25]
renderView1.StereoType = 0
renderView1.CameraPosition = [-26.72826427808721, 57.19543437663881, 1291.0758876151715]
renderView1.CameraFocalPoint = [251.08614159365808, 187.01584389208477, 96.45870810747545]
renderView1.CameraViewUp = [-0.3980904195600499, -0.8974323778470409, -0.1901029853692719]
renderView1.CameraParallelScale = 474.293990664046
renderView1.Background = [0.32, 0.34, 0.43]

# ----------------------------------------------------------------
# setup the data processing pipelines
# ----------------------------------------------------------------

# create a new 'Image Reader'
frog = ImageReader(FilePrefix='C:\\Users\\bastiaan\\Documents\\GitHub\\BasEnWouterOpAvontuur\\WholeFrog\\frog.')
frog.FilePattern = '%s%03d.raw'
frog.DataScalarType = 'unsigned char'
frog.FileDimensionality = '2'
frog.DataSpacing = [1.0, 1.0, 1.5]
frog.DataExtent = [0, 499, 0, 469, 1, 136]

# ----------------------------------------------------------------
# setup color maps and opacity mapes used in the visualization
# note: the Get..() functions create a new object, if needed
# ----------------------------------------------------------------

# get color transfer function/color map for 'ImageFile'
imageFileLUT = GetColorTransferFunction('ImageFile')
imageFileLUT.LockDataRange = 1
imageFileLUT.RGBPoints = [0.0254, 0.231373, 0.298039, 0.752941, 0.0254, 0.266666666666667, 0.352941176470588, 0.803921568627451, 134.742365188599, 0.8, 0.850980392156863, 0.929411764705882, 152.759255335999, 0.865003, 0.865003, 0.865003, 254.0, 0.729411764705882, 0.0980392156862745, 0.164705882352941, 254.0, 0.705882, 0.0156863, 0.14902]
imageFileLUT.NumberOfTableValues = 348
imageFileLUT.ScalarRangeInitialized = 1.0

# get opacity transfer function/opacity map for 'ImageFile'
imageFilePWF = GetOpacityTransferFunction('ImageFile')
imageFilePWF.Points = [0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.302083343267441, 0.5, 0.0, 6.18434810638428, 0.296875, 0.5, 0.0, 6.18434810638428, 0.0, 0.5, 0.0, 136.055648803711, 0.0, 0.5, 0.0, 136.055648803711, 0.385416686534882, 0.5, 1.0, 136.055648803711, 0.223958343267441, 0.5, 0.0, 151.074783325195, 0.520833373069763, 0.5, 0.0, 151.074783325195, 0.0, 0.5, 0.0, 254.0, 0.0, 0.5, 0.0]
imageFilePWF.ScalarRangeInitialized = 1

# ----------------------------------------------------------------
# setup the visualization in view 'renderView1'
# ----------------------------------------------------------------

# show data from frog
frogDisplay = Show(frog, renderView1)
# trace defaults for the display properties.
frogDisplay.Representation = 'Volume'
frogDisplay.ColorArrayName = ['POINTS', 'ImageFile']
frogDisplay.LookupTable = imageFileLUT
frogDisplay.OSPRayScaleArray = 'ImageFile'
frogDisplay.OSPRayScaleFunction = 'PiecewiseFunction'
frogDisplay.SelectOrientationVectors = 'ImageFile'
frogDisplay.ScaleFactor = 49.9
frogDisplay.SelectScaleArray = 'ImageFile'
frogDisplay.GlyphType = 'Arrow'
frogDisplay.GlyphTableIndexArray = 'ImageFile'
frogDisplay.DataAxesGrid = 'GridAxesRepresentation'
frogDisplay.PolarAxes = 'PolarAxesRepresentation'
frogDisplay.ScalarOpacityUnitDistance = 2.25892866694921
frogDisplay.ScalarOpacityFunction = imageFilePWF
frogDisplay.Slice = 67

vtkwrite('pierre.vtk', 'polydata', frog)

# ----------------------------------------------------------------
# finally, restore active source
SetActiveSource(frog)
# ----------------------------------------------------------------